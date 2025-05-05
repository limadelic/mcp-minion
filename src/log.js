import yaml from "js-yaml";
import _ from "lodash";

export function log(data, fields) {
  if (_.isArray(data))
    return _.each(data, item =>
      log(item, fields),
    );
  console.log(
    yaml.dump(
      fields ? _.pick(data, fields) : data,
    ),
  );
}
