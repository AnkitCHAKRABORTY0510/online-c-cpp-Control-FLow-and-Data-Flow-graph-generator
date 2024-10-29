const dns = require('dns');
const open = require('open');

const EC2_DNS = 'ec2-13-233-159-153.ap-south-1.compute.amazonaws.com';

const getEc2Ip = () => {
    dns.lookup(EC2_DNS, (err, address, family) => {
        if (err) {
            console.error(`DNS lookup error: ${err.message}`);
            return;
        }

        console.log(`Resolved IP: ${address}`);
        // Open the URL in the default browser
        open(`http://${address}`).catch(err => console.error('Error opening browser:', err));
    });
};

getEc2Ip();
