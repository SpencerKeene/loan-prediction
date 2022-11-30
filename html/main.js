const applicationFormElement = document.getElementsByClassName('application-form')[0]
const resultTextElement = document.getElementsByClassName('result-text')[0]

function serializeForm(form) {
	var obj = {};
	var formData = new FormData(form);
	for (var key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return obj;
};

function build_application() {
    const data = serializeForm(applicationFormElement)
    console.log({data});
}

async function evaluate_application(applcation) {
    const data = await fetch('http://localhost:7000', {
        method: 'POST',
        headers: {'Content-Type': 'applcation/json'},
        body: JSON.stringify(applcation)
    })
    return data.prediction
}


applicationFormElement.addEventListener('submit', async (event) => {
    const application = build_application()
    // const evaluation = await evaluate_application(application)

    // const result = evaluation >= 0.5 ? 'Approved' : 'Not Approved'
    // resultTextElement.innerText = `${result} - ${(evaluation*100).toFixed(3)}%`
})