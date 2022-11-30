const applicationFormElement = document.getElementsByClassName('application-form')[0]
const resultTextElement = document.getElementsByClassName('result-text')[0]
const loadingSpinnerElement = document.getElementsByClassName('loading-spinner')[0]

function getRadioValue(name) {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    for (const rb of radioButtons) {
        if (rb.checked) return rb.id
    }
}

function serializeForm(form) {
	var obj = {};
	var formData = new FormData(form);
	for (var key of formData.keys()) {
		obj[key] = formData.get(key) === 'on' ? getRadioValue(key) : formData.get(key);
	}
	return obj;
};

function capitalize(s) {
    return s.replace(/\b\w/, (c) => c.toUpperCase())
}

function matchAfterUnderscore(s) {
    return s.match(/(?<=_).*/)[0]
}

function build_application() {
    const formData = serializeForm(applicationFormElement)
    const application = {
        gender: capitalize(formData.gender),
        married: capitalize(matchAfterUnderscore(formData.married)),
        dependents: formData.dependents,
        education: capitalize(formData.education).replace('Non-', 'Not '),
        selfEmployed: capitalize(matchAfterUnderscore(formData['self-employed'])),
        applicantIncome: parseFloat(formData['applicant-income']),
        coapplicantIncome: parseFloat(formData['coapplicant-income']),
        loanAmount: parseFloat(formData['loan-amount']) / 1000,
        loanTerm: parseInt(formData['loan-term']),
        creditHistory: formData['credit-history'] === 'credit-history_satisfactory' ? 1 : 0,
        propertyArea: capitalize(formData.property),
    }
    console.log({application});
    return application
}

async function evaluate_application(application) {
    const res = await fetch('http://68.183.196.205:7000/evaluate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(application)
    })
    const data = await res.json()
    console.log({data});
    return data.prediction
}


applicationFormElement.addEventListener('submit', async (event) => {
    event.preventDefault()

    loadingSpinnerElement.style.display = 'inline-block'
    resultTextElement.innerText = ''
    
    const application = build_application()
    const evaluation = await evaluate_application(application)
    
    const isApproved = evaluation >= 0.5
    const result = isApproved ? 'Approved' : 'Not Approved'
    resultTextElement.innerText = `${result} - ${(evaluation*100).toFixed(1)}%`
    resultTextElement.style.color = isApproved ? 'var(--clr-primary-400)' : 'var(--clr-accent-400)'
    loadingSpinnerElement.style.display = 'none'
})