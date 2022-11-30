import tensorflow as tf
import joblib
import pandas as pd
from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/evaluate', methods=['POST'])
def evaluate_route():
    req_data = request.get_json()

    jointIncome = (req_data['applicantIncome'] + req_data['coapplicantIncome']) * 12 / 1000

    data = {
        'Gender': [ req_data['gender'] ],
        'Married': [ 1 if req_data['married'] == 'Yes' else 0 ],
        'Dependents': [ 3 if req_data['dependents'] == '3+' else int(req_data['dependents']) ],
        'Education': [ 1 if req_data['education'] == 'Graduate' else 0 ],
        'Self_Employed': [ 1 if req_data['selfEmployed'] == 'Yes' else 0 ],
        'ApplicantIncome': [ req_data['applicantIncome'] * 12 / 1000 ],
        'LoanAmount': [ req_data['loanAmount'] ],
        'Loan_Amount_Term': [ req_data['loanTerm'] ],
        'Credit_History': [ req_data['creditHistory'] ],
        'Property_Area': [ req_data['propertyArea'] ],
        'JointIncome': [ jointIncome ],
        'JointIncome_LoanAmount_Ratio': [ jointIncome / req_data['loanAmount'] ]
    }

    df = pd.DataFrame(data)

    pipeline = joblib.load('pipe.joblib')
    prepared = pipeline.transform(df)

    model = tf.keras.models.load_model('saved-model')
    prediction = model.predict(prepared)[0][0]

    return jsonify({'input': req_data, 'prediction': str(prediction)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7000)