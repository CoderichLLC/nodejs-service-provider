/**
 * ServiceProvider
 *
 * Provides centralized methods to create, store, and access services/functionality
 */
module.exports = new class ServiceProvider {
  #container = {
    service: new Map(),
    provider: new Map(),
  };

  new() { // eslint-disable-line class-methods-use-this
    return new ServiceProvider();
  }

  get(...keys) {
    const results = keys.flat().map(key => this.#container.service.get(key));
    return results.length < 2 ? results[0] : results;
  }

  set(key, value) {
    this.#container.service.set(key, value);
    return this;
  }

  delete(key) {
    this.#container.service.delete(key);
    return this;
  }

  await(...keys) {
    return Promise.all(keys.flat().map(key => this.#container.service.get(key))).then(results => (results.length < 2 ? results[0] : results));
  }

  resolve(...keys) {
    keys = keys.flat();

    return Promise.all(keys.map(key => this.#container.service.get(key))).then((results) => {
      results.forEach((result, i) => this.set(keys[i], result));
      return (results.length < 2 ? results[0] : results);
    });
  }

  register(key, factory) {
    this.#container.provider.set(key, factory);
    return this;
  }

  create(key, ...args) {
    return this.#container.provider.get(key)?.(...args);
  }

  use(key, ...args) {
    const [service] = key.split('@');
    if (!this.#container.service.has(key)) this.set(key, this.create(service, ...args));
    return this.#container.service.get(key);
  }

  useAsProto(key, ...args) {
    const [service] = key.split('@');
    const proto = this.use(key, ...args);
    this.set(service, proto);
    return proto;
  }

  useAsResolvedProto(key, ...args) {
    const [service] = key.split('@');
    const proto = this.use(key, ...args);
    this.set(service, proto); // This is an important step to set the unresolved proto

    return Promise.resolve(proto).then((resolvedProto) => {
      this.set(service, resolvedProto);
      return resolvedProto;
    });
  }
}();
