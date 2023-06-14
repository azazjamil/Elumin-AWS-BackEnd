const appStream = require("../data/amazon appstream.json");
const async = require("../middleware/async");
const _ = require("lodash");

const getSku = async(async (req, res) => {
  const { instanceFamily, instanceType, vcpu, memoryGib } = req.body;

  const matchingSKU = _.findKey(appStream.products, (product) => {
    const attributes = product.attributes;
    return (
      attributes.instanceFamily === instanceFamily &&
      attributes.instanceType === instanceType &&
      attributes.vcpu === vcpu &&
      attributes.memoryGib === memoryGib
    );
  });

  const matchingObjects = _.filter(
    appStream.terms.OnDemand,
    (product, key) => key === matchingSKU
  );

  if (matchingObjects) {
    res.send(matchingObjects);
  }

  //   res.send(null);
});

const getNextValue = async (req, res) => {
  const { attribute, values } = req.body;

  let filteredProducts = appStream.products;

  if (Object.keys(values).length > 1) {
    filteredProducts = _.filter(filteredProducts, (product) => {
      return Object.entries(values).every(
        ([key, value]) => product.attributes[key] === value
      );
    });
  } else if (Object.keys(values).length === 1) {
    const [key, value] = Object.entries(values)[0];
    filteredProducts = _.filter(filteredProducts, (product) => {
      return product.attributes[key] === value;
    });
  } else {
    return res.status(400).send("At least one value must be provided");
  }

  let uniqueCombinations;

  if (Array.isArray(attribute)) {
    const attributeCombinations = _.map(filteredProducts, (product) => {
      const combination = _.map(attribute, (attr) => {
        const attributeValue = product.attributes[attr];
        return `${attr}: ${attributeValue}`;
      });
      return combination.join(", ");
    });

    uniqueCombinations = _.uniq(attributeCombinations);
  } else {
    const attributeValues = _.map(
      filteredProducts,
      (product) => product.attributes[attribute]
    );

    uniqueCombinations = _.uniq(attributeValues);
  }

  res.send(uniqueCombinations);
};

const getUniqueValue = async(async (req, res) => {
  const attribute = req.body.attribute;

  const uniqueValues = _.uniq(
    _.map(appStream.products, (product) => product.attributes[attribute])
  );

  res.status(200).send(uniqueValues);
});

module.exports = {
  getSku,
  getUniqueValue,
  getNextValue,
};
