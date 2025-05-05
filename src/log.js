import yaml from "js-yaml";

export function log(data) {
  console.log(yaml.dump(data));
}
