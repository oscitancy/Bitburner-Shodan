/** @param {NS} ns **/
export async function main(ns)
{
    var fileType = ns.args[0];
	if (fileType === "")
	{
		ns.tprint("The first argument should be the file type (cct/js/lit/msg/txt)");
		ns.exit();
	}
	ns.disableLog('disableLog');
	ns.disableLog("scan");
	var hostname = 'home';
	var knownHostnames = new Set();
	knownHostnames.add(hostname);
	mapHost(ns, hostname, knownHostnames, fileType);
}

function mapHost(ns, hostname, knownHostnames, fileType)
{
	knownHostnames.add(hostname);
	var ip = ns.getServer(hostname)['ip'];
    var files = ns.ls(hostname);
    var relevantFiles = files.find(file => file.endsWith(fileType));
    if (relevantFiles)
    {
        ns.tprintf("%s", hostname);
        files.forEach((file) =>
        {
            if (file.endsWith(fileType)) ns.tprintf("    %s", file);
        });
		ns.tprintf("\n");
    }
	var links = ns.scan(hostname);
	links.forEach((link) =>
	{
		if (!knownHostnames.has(link))
		{
			mapHost(ns, link, knownHostnames, fileType);
		}
	});
}
