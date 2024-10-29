const AWS = require("aws-sdk");
const proxy = require("express-http-proxy");
const express = require("express");
const app = express();

// Configure the AWS SDK
AWS.config.update({ region: "ap-south-1" }); // Update with your region
const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

// Define the instance ID and port for forwarding
const instanceId = "i-yourinstanceid"; // Replace with your EC2 instance ID
const localPort = 3000; // Port to use for local proxy

// Function to retrieve current Public DNS of the EC2 instance
async function getInstancePublicDns() {
    const params = { InstanceIds: [instanceId] };
    const data = await ec2.describeInstances(params).promise();
    return data.Reservations[0].Instances[0].PublicDnsName;
}

// Function to start the proxy server
async function startProxy() {
    try {
        const publicDns = await getInstancePublicDns();
        console.log(`Current Public DNS: ${publicDns}`);

        // Set up an HTTP proxy to route traffic to the instance's public DNS
        app.use("/", proxy(`http://${publicDns}`, {
            proxyReqPathResolver: (req) => {
                return req.url;
            }
        }));

        app.listen(localPort, () => {
            console.log(`Proxy running at http://localhost:${localPort}, forwarding to ${publicDns}`);
        });
    } catch (error) {
        console.error("Error retrieving instance DNS:", error);
    }
}

startProxy();
