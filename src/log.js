import yaml from "js-yaml";

export function log(data, fields) {
  if (Array.isArray(data)) {
    data.forEach(item => log(item, fields));
    return;
  }

  if (fields && typeof data === "object") {
    const filtered = {};
    fields.forEach(
      field => (filtered[field] = data[field]),
    );
    console.log(yaml.dump(filtered));
    return;
  }

  console.log(yaml.dump(data));
}
