import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'

const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const keyValueTemplate = document.querySelector('[data-key-value-template]');

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

document.querySelector('[data-add-query-param-btn]').addEventListener('click', () => {
    queryParamsContainer.append(createKeyValuePair());
})

document.querySelector('[data-add-request-header-btn]').addEventListener('click', () => {
    requestHeadersContainer.append(createKeyValuePair());
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

