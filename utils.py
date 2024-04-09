from datetime import datetime, timedelta
import json
import requests
import jwt # Note this jwt id from PyJWT
import math
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.backends import default_backend

DATE_FORMAT = "%Y-%m-%d"
BUCKET_NAME = "meet1993shah-portfoliotracker-db" # Replace it with your bucket name
# Google Cloud Secrets JSON file that MUST contain 3 things -
#   "token_uri" (Ex - "https://oauth2.googleapis.com/token")
#   "private_key" (Ex - "-----BEGIN PRIVATE KEY-----\n<REDACTED>\n-----END PRIVATE KEY-----\n")
#   "client_email" (ex - "<your-service-account-name>@<your-project-id>.iam.gserviceaccount.com")
SECRETS_FILE = "gcp-secrets.json"
ACCESS_TOKEN = ""
ACCESS_TOKEN_LAST_SAVED_TIME = datetime.utcnow()
ACCESS_TOKEN_REFRESH_INTERVAL = timedelta(minutes=60)

# Define the model function
def model_func(x, p, r, c):
    r_prime = 1.0 + (r/36500.0)
    p_prime = p/365.0
    numerator =  1.0 - r_prime**((x+1.0)/365.0)
    denominator = 1.0 - r_prime**(1.0/365.0)
    c_prime = c * (r_prime**(x/365.0))
    return (p_prime * numerator / denominator) + c_prime

def inverse_model_func(y, p, r, c):
    r_prime = 1.0 + (r/36500.0)
    p_prime = p/365.0
    denominator = 1.0 - r_prime**(1.0/365.0)
    return 365.0 * math.log(((y*denominator)-p_prime)/((c*denominator) - (p_prime*(r_prime**(1.0/365.0)))),r_prime)

def fit_model(x_values, y_values):
    min_error = float('inf')
    best_params = None
    for p in range(20000, 1000001, 5000):
        for r in [(x / 10.0) for x in range(30, 401)]:
            for c in range(0, 1000001, 25000):
                params = (p, r, c)
                current_error = sum((model_func(x, p, r, c) - y)**2 for x, y in zip(x_values, y_values))
                if current_error < min_error:
                    min_error = current_error
                    best_params = params
    return best_params

def get_projections(X_date, Y_in):
    X_in = []
    start_date = datetime.strptime(X_date[0], DATE_FORMAT)
    for x in X_date:
        delta = datetime.strptime(x, DATE_FORMAT)-start_date
        X_in.append(int(delta.days)+1)

    # Curve fitting
    p_opt, r_opt, c_opt = fit_model(X_in, Y_in)
    
    # Projection for next month, 6 months, 1 year, 5 years, 10 years
    last_date_int = X_in[-1]
    X_proj_in = []
    for i in range(1,13):
        X_proj_in.append(last_date_int+(30*i))
    X_res_in = X_in + X_proj_in

    # Convert projected integer dates to actual dates
    X_proj_date = [(start_date + timedelta(days=x)).date().strftime(DATE_FORMAT) for x in X_proj_in]
    X_res_date = X_date + X_proj_date

    # Calculate projected Y values
    Y_proj = [model_func(x, p_opt, r_opt, c_opt) for x in X_proj_in]
    Y_res = Y_in + Y_proj

    return X_res_in, X_res_date, Y_res

def calculate_fire(X_date, Y_in, annual_expense, tax_rate, swr):
    fire_data = []
    fire_data.append({"field": "Annual Expenses Without Taxes($)", "value": round(annual_expense, 2)})
    fire_data.append({"field": "Effective Tax Rate in Retirement(%)", "value": round(tax_rate, 2)})
    fire_data.append({"field": "Safe Withdrawal Rate(%)", "value": round(swr, 2)})
    
    annual_expense_with_tax = (annual_expense * 100.0) / (100.0 - tax_rate)
    fire_data.append({"field": "Annual Expenses With Taxes($)", "value": round(annual_expense_with_tax, 2)})

    net_worth_needed = 100.0 * annual_expense_with_tax / swr
    fire_data.append({"field": "Net Worth Needed to Retire($)", "value": round(net_worth_needed, 2)})

    X_in = []
    start_date = datetime.strptime(X_date[0], DATE_FORMAT)
    for x in X_date:
        delta = datetime.strptime(x, DATE_FORMAT)-start_date
        X_in.append(int(delta.days)+1)

    p_opt, r_opt, c_opt = fit_model(X_in, Y_in)
    x = inverse_model_func(net_worth_needed, p_opt, r_opt, c_opt)
    x_approx = int(x+1.0)
    re_date = (start_date + timedelta(days=x_approx)).date().strftime(DATE_FORMAT)
    fire_data.append({"field": "Estimated Date of Retirement(yyyy-mm-dd)", "value": re_date})

    y_estimate = model_func(x_approx, p_opt, r_opt, c_opt)
    fire_data.append({"field": "Estimated Net Worth at Retirement($)", "value": round(y_estimate, 2)})

    return fire_data

# Function to fetch new access key for Google Cloud Storage
def get_new_access_token():
    with open(SECRETS_FILE) as f:
        key_data = json.load(f)
    url = key_data["token_uri"]
    private_key = key_data["private_key"]
    private_key_bytes = private_key.encode('utf-8')
    private_key_obj = load_pem_private_key(private_key_bytes, password=None, backend=default_backend())
    payload = {
        "iss": key_data["client_email"],
        "scope": "https://www.googleapis.com/auth/cloud-platform",
        "aud": url,
        "exp": datetime.utcnow() + ACCESS_TOKEN_REFRESH_INTERVAL,
        "iat": datetime.utcnow()
    }
    encoded_jwt = jwt.encode(payload, private_key_obj, algorithm='RS256')
    response = requests.post(url, data={
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": encoded_jwt
    })
    response_data = response.json()
    return response_data.get("access_token")

# Function to fetch access token
def get_access_token():
    global ACCESS_TOKEN, ACCESS_TOKEN_LAST_SAVED_TIME, ACCESS_TOKEN_REFRESH_INTERVAL
    if (ACCESS_TOKEN == "") or (datetime.utcnow() >= ACCESS_TOKEN_LAST_SAVED_TIME + ACCESS_TOKEN_REFRESH_INTERVAL):
        print("Generating new access token", flush=True)
        ACCESS_TOKEN = get_new_access_token()
        ACCESS_TOKEN_LAST_SAVED_TIME = datetime.utcnow()
    else:
        print("Reusing old access token")
    return ACCESS_TOKEN

# Function to download the database.db file from Google Cloud Storage
def download_from_store(fileName):
    try:
        access_token = get_access_token()
    except Exception as ex:
        raise Exception(f'error fetching access token: {repr(ex)}')
    url = f"https://storage.googleapis.com/storage/v1/b/{BUCKET_NAME}/o/{fileName}?alt=media"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)
    if response and response.status_code == 200:
        with open('database.db', 'wb') as db_file:
            db_file.write(response.content)
        print("DB downloaded successfully!", flush=True)
    else:
        raise Exception(f"Failed to download file. Response: {repr(response)}")

# Function to upload the database.db file to Google Cloud Storage
def upload_to_store(fileName):
    try:
        access_token = get_access_token()
    except Exception as ex:
        raise Exception(f'error fetching access token: {repr(ex)}')
    url = f"https://storage.googleapis.com/upload/storage/v1/b/{BUCKET_NAME}/o?uploadType=media&name={fileName}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/octet-stream",
    }
    with open('database.db', 'rb') as db_file:
        response = requests.post(url, headers=headers, data=db_file)
        if response and response.status_code == 200:
            print("DB uploaded successfully!", flush=True)
        else:
            raise Exception(f"Failed to upload file. Status code: {repr(response)}")

