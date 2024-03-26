import numpy as np
from scipy.optimize import curve_fit

# Define the model function
def model_func(x, a, b, c):
    return a * np.power(b, x) + c

def get_opt_params(X_in, Y_in):
    # Sample data points (replace with your actual data)
    x_data = np.array(X_in)
    y_data = np.array(Y_in)

    # Perform curve fitting
    popt, pcov = curve_fit(model_func, x_data, y_data)

    # Extract optimal parameters
    a_opt, b_opt, c_opt = popt
    return (a_opt, b_opt, c_opt)

def get_projections(X_in, Y_in, X_proj):
    # Sample data points (replace with your actual data)
    x_data = np.array(X_in)
    y_data = np.array(Y_in)

    # Perform curve fitting
    popt, pcov = curve_fit(model_func, x_data, y_data)

    # Extract optimal parameters
    a_opt, b_opt, c_opt = popt
    return [model_func(x, a_opt, b_opt, c_opt) for x in X_proj]

