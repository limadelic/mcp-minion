import yaml from "js-yaml";
import _ from "lodash";

const logArray = (data, fields) =>
  _.each(data, item => log(item, fields));

const logObject = (data, fields) =>
  console.log(
    yaml.dump(
      fields ? _.pick(data, fields) : data,
    ),
  );

export function log(data, fields) {
  if (_.isArray(data))
    return logArray(data, fields);
  if (_.isObject(data))
    return logObject(data, fields);
  console.log(data);
}
