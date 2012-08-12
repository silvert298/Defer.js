/*global require, define, module, describe, it, xit

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['lib/expect', 'lib/modelo'],
            node: ['./lib/expect', '../modelo/modelo.js'],
            browser: ['expect', 'modelo']
        };

    def.call(this, 'spec/modelo', deps[env], function (expect, modelo) {

        describe('The Modelo library', function () {

            it('loads in the current environment (' + env + ')', function () {

                expect(modelo).to.be.ok();

            });

            it('supports the basic style of object definition', function () {

                var T = modelo.define(),
                    i = new T();

                expect(T).to.be.ok();

                expect(T).to.be.a('function');

                expect(T.extend).to.be.a('function');

                expect(i).to.be.a(T);

            });

            it('supports the constructor style of object definition', function () {

                var T = modelo.define(function (options) {
                    this.name = options.name || 'Juan Pérez';
                }),
                    i = new T();

                expect(i).to.be.ok();

                expect(i.name).to.be('Juan Pérez');

                i = new T({name: 'Juan Pueblo'});

                expect(i.name).to.be('Juan Pueblo');

            });

            it('supports the mix-in style of object definition', function () {

                var Person,
                    Talker,
                    Walker,
                    Customer,
                    test_customer;

                Person = modelo.define(function (options) {
                    this.name = options.name || 'Juan Pérez';
                });

                Person.prototype.hello = function () {
                    return "Hello " + this.name + "!";
                };

                Talker = modelo.define(function (options) {
                    this.language = options.language || 'ES';
                });

                Talker.prototype.speak = function () {
                    if (this.language === 'EN') {
                        return "Hello.";
                    } else if (this.language === 'ES') {
                        return "Hola.";
                    } else {
                        return "...";
                    }
                };

                Walker = modelo.define(function (options) {
                    this.legs = options.legs || 2;
                });

                Walker.prototype.walk = function () {
                    return "These " + this.legs + " boots were made for walkin'.";
                };

                Customer = modelo.define(Person, Talker, Walker);

                expect(Customer.prototype.hello).to.be.a('function');
                expect(Customer.prototype.speak).to.be.a('function');
                expect(Customer.prototype.walk).to.be.a('function');

                test_customer = new Customer();

                expect(test_customer).to.be.a(Customer);

                expect(test_customer.hello()).to.be('Hello Juan Pérez!');
                expect(test_customer.speak()).to.be('Hola.');
                expect(test_customer.walk()).to.be("These 2 boots were made for walkin'.");

            });

            describe('property generator', function () {

                it('generates undefined properties', function () {

                    var T = modelo.define(function (options) {
                        this.name = modelo.property();
                        this.age = modelo.property();
                    }),
                    i = new T();

                    // Test default values of `undefined`.
                    expect(i.name()).to.be(undefined);
                    expect(i.age()).to.be(undefined);

                    // Test ability to set values and retrieve
                    // those new values.
                    i.name('Juan Pérez');
                    i.age(43);
                    expect(i.name()).to.be('Juan Pérez');
                    expect(i.age()).to.be(43);

                    // Test the fluid interface option and check
                    // for the appropriate self references.
                    expect(i.age(43)).to.be(i);
                    expect(i.name('Juan Pérez')).to.be(i);

                });

                it('generates string properties', function () {

                    var T = modelo.define(function (options) {
                        this.name = modelo.property("string");
                    }),
                    i = new T();

                    // Test default value and nullability.
                    expect(i.name()).to.be(undefined);
                    expect(function () {
                        i.name(null);
                    }).to.not.throwError();
                    expect(i.name()).to.be(null);

                    // Test fluid interface option.
                    expect(i.name('Juan Pérez')).to.be(i);
                    expect(i.name()).to.be('Juan Pérez');

                    // Test not null validation
                    T = modelo.define(function (options) {
                        this.name = modelo.property("string", {
                            nullable: false
                        });
                    });
                    i = new T();

                    // Test nullability and type checking.
                    expect(i.name()).to.be(undefined);
                    expect(function () {
                        i.name(null);
                    }).to.throwError();
                    expect(i.name()).to.be(undefined);

                    expect(function () {
                        i.name(12534);
                    }).to.throwError();

                    // Test length validations
                    T = modelo.define(function (options) {
                        this.name = modelo.property("string", {
                            nullable: false,
                            min_length: 2,
                            max_length: 3
                        });
                    });
                    i = new T();

                    expect(i.name()).to.be(undefined);
                    expect(function () {
                        i.name('1');
                    }).to.throwError();
                    expect(i.name()).to.be(undefined);

                    expect(function () {
                        i.name('12');
                    }).to.not.throwError();
                    expect(i.name()).to.be('12');

                    expect(function () {
                        i.name('123');
                    }).to.not.throwError();
                    expect(i.name()).to.be('123');

                    expect(function () {
                        i.name('1234');
                    }).to.throwError();
                    expect(i.name()).to.be('123');

                });

                it('generates boolean properties', function () {

                    var T = modelo.define(function (options) {
                        this.bool = modelo.property("boolean");
                    }),
                    i = new T();

                    // Test default value and nullability.
                    expect(i.bool()).to.be(undefined);
                    expect(function () {
                        i.bool(null);
                    }).to.not.throwError();
                    expect(i.bool()).to.be(null);

                    // Test fluid interface option.
                    expect(i.bool(true)).to.be(i);
                    expect(i.bool()).to.be(true);

                    // Test not null validation
                    T = modelo.define(function (options) {
                        this.bool = modelo.property("boolean", {
                            nullable: false
                        });
                    });
                    i = new T();

                    // Test nullability and type checking.
                    expect(i.bool()).to.be(undefined);
                    expect(function () {
                        i.bool(null);
                    }).to.throwError();
                    expect(i.bool()).to.be(undefined);

                    expect(function () {
                        i.bool(12534);
                    }).to.throwError();

                });

                it('generates number properties', function () {

                    var T = modelo.define(function (options) {
                        this.num = modelo.property("number");
                    }),
                    i = new T();

                    // Test default value and nullability.
                    expect(i.num()).to.be(undefined);
                    expect(function () {
                        i.num(null);
                    }).to.not.throwError();
                    expect(i.num()).to.be(null);

                    // Test fluid interface option.
                    expect(i.num(123)).to.be(i);
                    expect(i.num()).to.be(123);

                    // Test not null validation
                    T = modelo.define(function (options) {
                        this.num = modelo.property("number", {
                            nullable: false
                        });
                    });
                    i = new T();

                    // Test nullability and type checking.
                    expect(i.num()).to.be(undefined);
                    expect(function () {
                        i.num(null);
                    }).to.throwError();
                    expect(i.num()).to.be(undefined);

                    expect(function () {
                        i.num('12534');
                    }).to.throwError();

                    expect(function () {
                        i.num(12534);
                    }).to.not.throwError();

                    // Test value validations
                    T = modelo.define(function (options) {
                        this.num = modelo.property("number", {
                            nullable: false,
                            min_value: 2,
                            max_value: 3
                        });
                    });
                    i = new T();

                    expect(i.num()).to.be(undefined);
                    expect(function () {
                        i.num(1);
                    }).to.throwError();
                    expect(i.num()).to.be(undefined);

                    expect(function () {
                        i.num(2);
                    }).to.not.throwError();
                    expect(i.num()).to.be(2);

                    expect(function () {
                        i.num(3);
                    }).to.not.throwError();
                    expect(i.num()).to.be(3);

                    expect(function () {
                        i.num(4);
                    }).to.throwError();
                    expect(i.num()).to.be(3);

                });

            });

        });

    });

}.call(this, (function () {
    "use strict";

    var currentEnvironment,
        generator;

    // Check the environment to determine the dependency management strategy.

    if (typeof define === "function" && !!define.amd) {

        currentEnvironment = 'amd';

    } else if (typeof require === "function" &&
                        module !== undefined && !!module.exports) {

        currentEnvironment = 'node';

    } else if (this.window !== undefined) {

        currentEnvironment = 'browser';

    }

    generator = (function () {
        switch (currentEnvironment) {

        case 'amd':

            // If RequireJS is used to load this module then return the global
            // define() function.
            return function (name, deps, mod) {
                define(deps, mod);
            };

        case 'node':

            // If this module is loaded in Node, require each of the
            // dependencies and pass them along.
            return function (name, deps, mod) {

                var x,
                    dep_list = [];

                for (x = 0; x < deps.length; x = x + 1) {

                    dep_list.push(require(deps[x]));

                }

                module.exports = mod.apply(this, dep_list);

            };

        case 'browser':

            // If this module is being used in a browser environment first
            // generate a list of dependencies, run the provided definition
            // function with the list of dependencies, and insert the returned
            // object into the global namespace using the provided module name.
            return function (name, deps, mod) {

                var namespaces = name.split('/'),
                    root = this,
                    dep_list = [],
                    current_scope,
                    current_dep,
                    i,
                    x;

                for (i = 0; i < deps.length; i = i + 1) {

                    current_scope = root;
                    current_dep = deps[i].split('/');

                    for (x = 0; x < current_dep.length; x = x + 1) {

                        current_scope = current_scope[current_dep[x]] || {};

                    }

                    dep_list.push(current_scope);

                }

                current_scope = root;
                for (i = 1; i < namespaces.length; i = i + 1) {

                    current_scope = current_scope[namespaces[i - 1]] || {};

                }

                current_scope[namespaces[i - 1]] = mod.apply(this, dep_list);

            };

        default:
            throw new Error("Unrecognized environment.");

        }

    }.call());


    return {
        env: currentEnvironment,
        def: generator
    };

}.call(this))));
