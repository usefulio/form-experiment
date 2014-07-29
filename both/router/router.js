Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

Router.map(function () {

	this.route("home", {path: "/", controller: "HomeController"});
	this.route("about", {path: "/about", controller: "AboutController"});/*ROUTER_MAP*/
});
