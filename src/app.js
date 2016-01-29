const React = require('react')
const { render } = require('react-dom')
const { renderToStaticMarkup } = require('react-dom/server')
const { Router, match, RoutingContext } = require('react-router')
const { createHistory, createMemoryHistory } = require('history');

const Root = require('./components/root')
const routes = require('./routes')

if (typeof document !== 'undefined') {
  const history = createHistory();
  const app = document.getElementById('app');

  render(<Router history={history} routes={routes} />, app);
}

module.exports = function render(locals, callback) {
	const history = createMemoryHistory()
	const location = history.createLocation(locals.path)

	match({routes, location }, function(error, redirectLocation, renderProps) {
		var html = renderToStaticMarkup(<Root><RoutingContext {...renderProps} /></Root>)
		callback(null, '<!DOCTYPE html>' + html)
	})
}