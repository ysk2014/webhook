
var http = require('http');
// var parseurl = require('parseurl');
var childProcess = require('child_process');

function main(req, res, data) {
    if (data.commits) {
        var project_name = data.repository.name,
            trigger_user = data.user.global_key,
            commit_user = data.commits[0].committer.name,
            commit_user_email = data.commits[0].committer.email,
            commit_message = data.commits[0].short_message;

        var exec = childProcess.exec;

        exec('cd ./'+project_name+' && git pull origin master && pm2 restart movie', function(err, stdout, stderr) {
            res.end();
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
