import httplib2
import sys

http = httplib2.Http()

parameters = sys.argv[1:]

for index, parameter in enumerate(parameters):
    if index >= 1:
        parameters[index] = int(parameter)

print(parameters)
url = "http://localhost:4000/%s/%d/%d/%d" % tuple(parameters)
print(url)

(result, response) = http.request(url, method="POST")
if result.status == 200:
    print("OK.")
else:
    print("Failed.")
    print(result)
