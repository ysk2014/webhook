
var http = require('http');
// var parseurl = require('parseurl');
var childProcess = require('child_process');

function main(req, res, data) {
    if (data.ref == 'refs/heads/master' && data.commits) {
        var project_name = data.repository.name;

        var exec = childProcess.exec;
        console.log(project_name);

        if (project_name == 'webhook') {
            var shell = 'git pull origin master && pm2 restart 0';
        } else {
            var shell = 'git pull origin master && pm2 restart 1';
        }

        var workerProcess = exec(shell, {
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
