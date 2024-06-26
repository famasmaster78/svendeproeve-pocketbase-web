import os from 'os';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	
	let nets = os.networkInterfaces();

	// Results
	let results: Ips[] = [];

	// Loop through the nets
	for (const name of Object.keys(nets)) {
		if (name in nets && nets[name]) {

			// Create an array of IPs
			let ips: string[] = [];

			// Loop through the nets
			for (const net of nets[name] as os.NetworkInterfaceInfo[]) {
				// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
				// 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
				const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
				if (net.family === familyV4Value && !net.internal) {
					
					// Add the IP to the array
					ips.push(net.address);

				}
			}

			// If no IPs, skip
			if (!ips.length) {
				continue;
			}

			// Add to the results
			results.push({
				name,
				ip: ips,
				hostname: os.hostname()
			});
		}
	}

	// Return	
	return {
		ip: results,
	};
};

// Type ips
export type Ips = {
	name: string;
	ip: string[];
	hostname: string;
};