const dns = require('dns');
const http = require('http');
const httpProxy = require('http-proxy');

// Replace with your actual DNS
const dnsName = 'ec2-13-233-159-153.ap-south-1.compute.amazonaws.com';
const PORT = 3000; // Port for your local server

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Function to resolve DNS and start the HTTP server
function startProxy() {
    dns.lookup(dnsName, (err, ipAddress) => {
        if (err) {
            console.error(`Error resolving DNS: ${err.message}`);
            return;
        }
        
        console.log(`Resolved ${dnsName} to ${ipAddress}`);

        // Create a local server that forwards requests to the EC2 instance IP
        const server = http.createServer((req, res) => {
            proxy.web(req, res, { target: `http://${ipAddress}` }, (e) => {
                console.error(`Proxy error: ${e.message}`);
                res.writeHead(502);
                res.end('Bad Gateway');
            });
        });

        server.listen(PORT, () => {
            console.log(`Proxy server is running at http://localhost:${PORT}`);
        });
    });
}

// Start the proxy
startProxy();

