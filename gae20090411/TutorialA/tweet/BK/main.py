import wsgiref.handlers
from pyamf.remoting.gateway.wsgi import WSGIGateway

#def echo(data):
#    return data

def echo(data):
    first = "<line>\n"
    messsage = "<contents>" + data + "</contents>\n"
    messsage = data*10
    last = "</line>"
    return first + content + last

services = {
            'echo': echo,
}

def main():
        application = WSGIGateway(services)
        wsgiref.handlers.CGIHandler().run(application)

if __name__ == '__main__':
        main()