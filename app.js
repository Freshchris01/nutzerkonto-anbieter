'use strict';

const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');

require('dotenv').config();

const config = require('./config');

const app = express();

app.use('/css', express.static(__dirname + '/css'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Handlebars view engine

app.engine('hbs', expressHbs({
	extname: 'hbs',
	defaultLayout: 'layout.hbs',
	relativeTo: __dirname
}));
app.set('view engine', 'hbs');

app.get('/success', (req, res) => {
	res.render('success');
});

const serviceProvider = {
	name: 'Bafög leistungsabhängiger Teilerlass',
	path: process.env.HOST_NUTZERKONTO_SP,
	dataKeys: ['anrede', 'titel', 'namensbestandteil', 'nachname', 'vorname', 'geburtsdatum', 'geburtsname', 'studiumAbschlussdatum', 'bemerkung'],
	template: 'anbieterBafoegLeistungsabhaengigerTeilerlass'
};

app.get('/', (req, res) => {
	if (req.query.wantedKeys) {
		const availableKeys = serviceProvider.dataKeys;
		const wantedKeys = JSON.parse(req.query.wantedKeys);
		const dataKeys = getIntersection(availableKeys, wantedKeys);
		axios.get(`${process.env.HOST_NUTZERKONTO}/nutzerkonto-datenuebertragen`, {
			headers: {
				Cookie: buildCookieString(req.cookies)
			},
			params: {
				dataKeys: JSON.stringify(dataKeys)
			}
		}).then(response => {
			const templateData = {
				title: serviceProvider.name,
				dataKeys: Object.keys(response.data),
				data: response.data,
				redirect: serviceProvider.path,
			};
			res.render(serviceProvider.template, templateData);
		}).catch(error => {
			console.log(error);
		});
	} else {
		const templateData = {
			title: serviceProvider.name,
			dataKeys: serviceProvider.dataKeys,
			redirect: serviceProvider.path,
			login_action_host: process.env.HOST_NUTZERKONTO
		};
		res.render(serviceProvider.template, templateData);
	}
});

function buildCookieString(cookies) {
	let cookieString = '';
	for (let cookieKey in cookies) {
		cookieString += `${cookieKey}=${cookies[cookieKey]};`;
	}
	return cookieString;
}

function getIntersection(array1, array2) {
	// https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
	return array1.filter(value => -1 !== array2.indexOf(value));
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.send(err.message);
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message);
});

app.set('port', process.env.PORT || 3001);

const server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + server.address().port);
});