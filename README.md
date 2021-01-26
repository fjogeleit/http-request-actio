# HTTP Request Action

Create any kind of HTTP Requests in your GitHub actions to trigger Tools like Ansible AWX

Example Usage:
```
jobs:
  deployment:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy Stage
      uses: fjogeleit/http-request-action@master
      with:
        url: 'https://ansible.io/api/v2/job_templates/84/launch/'
        method: 'POST'
        username: ${{ secrets.AWX_USER }}
        password: ${{ secrets.AWX_PASSWORD }}
```

### Input Arguments

|Argument|  Description  |  Default  |
|--------|---------------|-----------|
|url     | Request URL   | _required_ Field |
|method  | Request Method| POST |
|contentType  | Request ContentType| application/json |
|data    | Request Body Content as JSON String, only for POST / PUT / PATCH Requests | '{}' |
|files    | Map of key / absolute file paths send as multipart/form-data request to the API, if set the contentType is set to multipart/form-data, values provided by data will be added as additional FormData values, nested objects are not supported. **Example provided in the _test_ Workflow of this Action** | '{}' |
|timeout| Request Timeout in ms | 5000 (5s) |
|username| Username for Basic Auth ||
|password| Password for Basic Auth ||
|bearerToken| Bearer Authentication Token (without Bearer Prefix) ||
|customHeaders| Additional header values as JSON string, keys in this object overwrite default headers like Content-Type |'{}'|
|preventFailureOnNoResponse| Prevent this Action to fail if the request respond without an response. Use 'true' (string) as value to enable it ||
|escapeData| Escape newlines in data string content. Use 'true' (string) as value to enable it ||

### Output

- `response` Request Response as JSON String


### Additional Information

Additional information is available if debug logging is enabled:
- Instance Configuration (Url / Timeout / Headers)
- Request Data (Body / Auth / Method)

To [enable debug logging in GitHub Actions](https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging) create a secret `ACTIONS_RUNNER_DEBUG` with a value of `true`