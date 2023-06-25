const workSpace = require("../data/amazon workspaces.json");
const async = require("../middleware/async");
const _ = require("lodash");

const getSku = async(async (req, res) => {
  const {
    license,
    bundleGroup,
    vcpu,
    operatingSystem,
    storage,
    memory,
    groupDescription,
  } = req.body;

  const matchingSKU = _.findKey(workSpace.products, (product) => {
    const attributes = product.attributes;
    return (
      attributes.license === license &&
      attributes.bundleGroup === bundleGroup &&
      attributes.vcpu === vcpu &&
      attributes.operatingSystem === operatingSystem &&
      attributes.storage === storage &&
      attributes.groupDescription === groupDescription &&
      attributes.memory === memory
    );
  });

  const matchingObjects = _.filter(
    workSpace.terms.OnDemand,
    (product, key) => key === matchingSKU
  );

  res.send(matchingObjects);
});

const getUniqueValue = async (req, res) => {
  const attribute = req.body.attribute;
  const timeStamp = req.body.timeStamp;

  if (!workSpace.products || typeof workSpace.products !== "object") {
    res.status(400).send("Products not found or invalid data");
    return;
  }

  const productsArray = Object.values(workSpace.products);
  const filteredProducts = productsArray.filter(
    (product) => product.attributes.groupDescription === timeStamp
  );

  const uniqueValues = _.uniq(
    _.map(filteredProducts, (product) => product.attributes[attribute])
  );

  res.status(200).send(uniqueValues);
};

const getNextValue = async (req, res) => {
  const { attribute, values } = req.body;

  let filteredProducts = workSpace.products;

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

module.exports = {
  getSku,
  getUniqueValue,
  getNextValue,
};
