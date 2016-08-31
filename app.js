
var http = require('http');
// var parseurl = require('parseurl');
var childProcess = require('child_process');

function main(req, res, data) {
    if (data.commits) {
        var project_name = data.repository.name;
        console.log(data);
        console.log(data.repository);
        console.log(data.commits);

        var exec = childProcess.exec;
        console.log(project_name);

        var workerProcess = exec('git pull origin master && pm2 restart 1', {
            cwd: '../'+project_name
        }, function(err, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            workerProcess.kill();
            res.end();
        });
        workerProcess.on('exit', function (code) {
            console.log('子进程已退出，退出码 '+code);
        });
    } else {
        res.end();
    }
}


var server = http.createServer(function(req, res) {
    if (req.method == 'POST') {
        var data = '';

        req.on('data', function(chunk) {
            data += chunk;
        });

        req.on('end', function() {
            try {
                data = JSON.parse(data);
            } catch(err) {
                data = {};
            }
            main(req, res, data);
        });
    } else {
        res.writeHead(404);
        res.end('not found');
    }
});

server.listen(3000);
