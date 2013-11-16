//Lisp interpreter in Javascript
var Symbol = String;
function Environment(dict){
        var env={},outer=dict.outer || {};
        if (dict.parms.length!=0){
                for (var i=0;i<dict.parms.length;i++){
                        env[dict.parms[i]]=dict.args[i];}
        }
        env.find=function(variable){
                if (env.hasOwnProperty(variable)){
                        return env;}
                else{
                        return outer.find(variable);}
        }
        return env;
}
//Add global variables to environment
function addglobals(env)
{
        env['+']=function(a,b){
                return a+b;}
        env['-']=function(a,b){
                return a-b;}
        env['*']=function(a,b){
                return a*b;}
        env['/']=function(a,b){
                return a/b;}
        env['>']=function(a,b){
                return a>b;}
        env['<']=function(a,b){
                return a<b;}
        env['>=']=function(a,b){
                return a>=b;}
        env['<=']=function(a,b){
                return a<=b;}
        env['=']=function(a,b){
                return a===b;}
        env['remainder']=function(a,b){
		return a%b;}
        env['equal?']=function(a,b){
		return a===b;}
        env['eq?']=function(a,b){
		return a===b;}
        env['not']=function(a){
		return !a;}
        env['length']=function(a){
		return a.length;}
        env['cons']=function(a,b){
		var array=[a]; return array.concat(b);}
        env['car']=function(a){
		return (a.length !==0) ? a[0] : null;}
        env['cdr']=function(a){
		return (a.length>1) ? a.slice(1) : null;}
        env['append']=function(a,b){
		return a.concat(b);}
        env['list']=function(){
		return Array.prototype.slice.call(arguments);}
        env['list?']=function(a){
		return a && typeof a==='object' && a.constructor === Array;}
        env['null?']=function(a){
		return (!a || a.length===0)}
        env['symbol?']=function(a){
		return typeof a==='string';}
        return env;
}
var global_env=addglobals(Environment({parms:[],args:[],outer:undefined}));
//Defining evaluation function
var eval=function(x,env){
        var i=0;
        env=env || global_env;
        if (typeof x==='string'){
                return env.find(x.valueOf())[x.valueOf()];}
        else if (typeof x==='number'){
                return x;}
        else if (x[0]==='quote'){
                return x[1];}
        else if (x[0]=='if'){
                var test=x[1];
                var conseq=x[2];
                var alt=x[3];
                if (eval(test,env)){
                        return eval(conseq,env);}
                else{
                        return eval(alt,env);}
        }
        else if(x[0]==='set!'){
                env.find(x[1])[x[1]]=eval(x[2],env);}
        else if (x[0]==='define'){
                env[x[1]]=eval(x[2],env);}
        else if (x[0]==='lambda'){
                var vars=x[1];
                var exp=x[2];
                return function(){
                        return eval(exp,Environment({parms:vars,args:arguments,outer:env}));}
        }
        else if (x[0]==='begin'){
                var val;
                for (var i=1;i<x.length;i+=1)
                        val=eval(x[i],env);
                return val;}
        else{
                var exps=[];
                for (i=0;i<x.length;i+=1)
                        exps[i]=eval(x[i],env);
                var proc=exps.shift();
                return proc.apply(env,exps);}
}
// Parsing of string
function read(string){
        return read_from(tokenize(string))}
//convert input string into tokens
var tokenize=function(s){
        return s.replace(/\(/g,' ( ').replace(/\)/g,' ) ').trim().replace(/\s+/g,' ').split(' ')}

var read_from=function(tokens){
        if (tokens.length==0){console.log("SyntaxError");}
        var token=tokens.shift();
        if ('('===token){var L=[]; while(')'!==tokens[0]){
                        L.push(read_from(tokens));}
                tokens.shift();
                return L;
        }
        else{
                if (')'===token){
                        console.log("SyntaxError");
                }
                else {
                        return atom(token);}
        }
}
var atom=function(token){
        if (isNaN(token)){
                return token;
        }
        else{
                return +token;
        }
}
//repl function
var parse=read;
function repl(){
        process.stdin.resume();
        process.stdout.write('Lisp >>> ');
        process.stdin.on('data',function(input){
                input = input.toString().trim();
                var output = eval(parse(input))
                if (output != undefined){
                        process.stdout.write(output+'\nLisp >>> ');
                }
                else{
                        process.stdout.write('Lisp >>> ');}});
}
repl()
