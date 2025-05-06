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
  if (_.isArray(data)) logArray(data, fields);
  else if (_.isObject(data))
    logObject(data, fields);
  else console.log(data);
}
