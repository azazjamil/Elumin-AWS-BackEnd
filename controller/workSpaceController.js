const workSpace = require("../data/amazon workspaces.json");
const async = require("../middleware/async");
const _ = require("lodash");

const getSku = async (req, res) => {
  const {
    license,
    bundleGroup,
    vcpu,
    storage,
    memory,
    operatingSystem,
    runningMode,
    group,
  } = req.body;
  if (operatingSystem === "Workspaces Core") {
    operatingSystem === "Any";
  }
  if (runningMode === "AlwaysOn") {
    const matchingSKU = _.findKey(workSpace.products, (product) => {
      const attributes = product.attributes;
      return (
        attributes.license === license &&
        attributes.bundleGroup === bundleGroup &&
        attributes.vcpu === vcpu &&
        attributes.storage === storage &&
        attributes.memory === memory &&
        attributes.operatingSystem === operatingSystem &&
        attributes.resourceType !== "Software" &&
        attributes.runningMode === runningMode
      );
    });

    const matchingObjects = _.filter(
      workSpace.terms.OnDemand,
      (product, key) => key === matchingSKU
    );

    res.send(matchingObjects);
  }
  if (runningMode === "AutoStop") {
    const matchingSKUs = _.filter(workSpace.products, (product) => {
      const attributes = product.attributes;
      return (
        attributes.license === license &&
        attributes.bundleGroup === bundleGroup &&
        attributes.vcpu === vcpu &&
        attributes.storage === storage &&
        attributes.memory === memory &&
        attributes.operatingSystem === operatingSystem &&
        // attributes.resourceType !== "Software" &&
        attributes.runningMode === "AutoStop"
      );
    });

    const matchingObjects = _.filter(workSpace.terms.OnDemand, (term, key) =>
      matchingSKUs.some((sku) => sku.sku === key)
    );
    var price;
    var price1;
    for (const obj of matchingObjects) {
      findDescriptionAndUSD(obj);
    }
    function findDescriptionAndUSD(obj) {
      if (typeof obj === "object") {
        // if ("description" in obj) {
        // Apply your condition on the description value
        // if (
        // obj.description.includes("month-Hourly") ||
        // obj.description.includes("per month") ||
        //   obj.description.toLowerCase().includes("month")
        // ) {
        // console.log("Description:", obj.description);
        // console.log(price);
        //   monthlyPrice = price;
        //   console.log(monthlyPrice);
        // } else if (
        // obj.description.includes("hour-Hourly") ||
        // obj.description.includes("per hour") ||
        //   obj.description.toLowerCase().includes("hour")
        // ) {
        // console.log("Description:", obj.description);
        // console.log(price);
        //     hourlyPrice = price;
        //     console.log(hourlyPrice);
        //   } else {
        //     price = null;
        //   }
        // }
        if ("USD" in obj) {
          if (!price) {
            price = obj.USD;
          } else {
            price1 = obj.USD;
          }
        }

        for (const key in obj) {
          findDescriptionAndUSD(obj[key]);
        }
      }
    }
    const data = {
      price: price,
      price1: price1,
    };
    res.send(data);
  }
};

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
    _.map(productsArray, (product) => product.attributes[attribute])
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
