import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'
import prettyBytes from "pretty-bytes";

const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const responseHeadersContainer = document.querySelector('[data-response-headers]');
const keyValueTemplate = document.querySelector('[data-key-value-template]');
const form = document.querySelector('[data-form]');

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

document.querySelector('[data-add-query-param-btn]').addEventListener('click', (e) => {
    e.preventDefault();
    queryParamsContainer.append(createKeyValuePair());
})

document.querySelector('[data-add-request-header-btn]').addEventListener('click', (e) => {
    e.preventDefault();
    requestHeadersContainer.append(createKeyValuePair());
})

axios.interceptors.request.use(request => {
    request.customData = request.customData || {};
    request.customData.startTime = new Date().getTime();
    return request;
});

axios.interceptors.response.use(updateEndTime, e => {
    return Promise.reject(updateEndTime(e.response));
})

function updateEndTime(response) {
    response.customData = response.customData || {}
    // response.config will give our request
    response.customData.time = new Date().getTime() - response.config.customData.startTime;
    return response;
}

form.addEventListener('submit', e => {
    console.log("form submitted");
    e.preventDefault();

    console.log(keyValuePairsToObjects(queryParamsContainer));
    console.log(keyValuePairsToObjects(requestHeadersContainer));

     axios({
        url: document.querySelector('[data-url]').value,
        method: document.querySelector('[data-method]').value,
        params: keyValuePairsToObjects(queryParamsContainer),
        headers: keyValuePairsToObjects(requestHeadersContainer)
     })
    .catch(e => e)
    .then((res) => {
        document.querySelector('[data-response-section]').classList.remove("d-none");
        updateResponseDetails(res);
        // updateResponseEditor(res.data);
        updateResponseHeaders(res.headers);
        console.log(res);
     })
})

function createKeyValuePair() {
    /**
     * The cloneNode() method of the Node interface returns a duplicate of the node on which this method was called.
     * Its parameter controls if the subtree contained in a node is also cloned or not.
     * 
     * cloneNode(deep)
     */
    const element = keyValueTemplate.content.cloneNode(true);
    element.querySelector('[data-remove-btn]').addEventListener('click', e => {
        /**
         * The closest() method of the Element interface traverses the element and its parents (heading toward the document root)
         * until it finds a node that matches the specified CSS selector.
         */
        e.target.closest('[data-key-value-pair]').remove()
    });

    return element;
}


function keyValuePairsToObjects(container) {
    const pairs = container.querySelectorAll('[data-key-value-pair]');
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector('[data-key]').value;
        const value = pair.querySelector('[data-value]').value;

        if(key === '') return data;
        return {...data, [key]: value}
    }, {})
}

function updateResponseDetails(response) {
    document.querySelector('[data-status]').textContent = response.status;
    document.querySelector('[data-time]').textContent = response.customData.time;
    document.querySelector('[data-size]').textContent = prettyBytes(
        JSON.stringify(response.data).length + JSON.stringify(response.headers).length
    );
}

function updateResponseHeaders(headers) {
    responseHeadersContainer.innerHTML = "";
    Object.entries(headers).forEach(([key, value]) => {
        const keyElement = document.createElement('div');
        keyElement.textContent = key;
        responseHeadersContainer.append(keyElement);
        const valueElement = document.createElement('div');
        valueElement.textContent = value;
        responseHeadersContainer.append(valueElement)
    })
}