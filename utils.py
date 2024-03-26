import numpy as np
from scipy.optimize import curve_fit
from datetime import datetime, timedelta

DATE_FORMAT = "%Y-%m-%d"

# Define the model function
def model_func(x, a, b, c):
    return (a * np.exp(b*x)) + c

def get_projections(X_date, Y_in):
    X_in = []
    start_date = datetime.strptime(X_date[0], DATE_FORMAT)
    for x in X_date:
        delta = datetime.strptime(x, DATE_FORMAT)-start_date
        X_in.append(int(delta.days))

    # Curve fitting
    popt, pcov = curve_fit(model_func, np.array(X_in), np.array(Y_in))
    a_opt, b_opt, c_opt = popt
    
    # Projection for next month, 6 months, 1 year, 5 years, 10 years
    last_date_int = X_in[-1]
    X_proj_in = [last_date_int+30, last_date_int+180]
    X_res_in = X_in + X_proj_in

    # Convert projected integer dates to actual dates
    X_proj_date = [(start_date + timedelta(days=x)).date().strftime(DATE_FORMAT) for x in X_proj_in]
    X_res_date = X_date + X_proj_date

    # Calculate projected Y values
    Y_proj = [model_func(x, a_opt, b_opt, c_opt) for x in X_proj_in]
    Y_res = Y_in + Y_proj

    return X_res_in, X_res_date, Y_res
