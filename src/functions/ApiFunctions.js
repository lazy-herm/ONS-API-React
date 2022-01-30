// GET DATASET LIST
export async function getDatasetList() {
  const response = await fetch("https://api.beta.ons.gov.uk/v1/datasets");
  const data = await response.json();
  const finalData = await data.items.map((dataset) => {
    return {
      ...dataset,
      label: dataset.title,
      newId: dataset.id,
      value: dataset.id,
    };
  });
  return await finalData;
}

// GET EDITION LIST
export async function getEditionList(datasetId) {
  const response = await fetch(
    "https://api.beta.ons.gov.uk/v1/datasets/" + datasetId + "/editions"
  );
  const data = await response.json();
  const finalData = await data.items.map((edition) => {
    return {
      ...edition,
      label: edition.edition,
      newId: edition.edition + "&&" + datasetId,
      value: edition.edition,
    };
  });
  return await finalData;
}

// GET VERSION LIST
export async function getVersionList(datasetId, edition) {
  const response = await fetch(
    "https://api.beta.ons.gov.uk/v1/datasets/" +
      datasetId +
      "/editions/" +
      edition +
      "/versions"
  );
  const data = await response.json();
  const finalData = await data.items.map((version) => {
    let newDimensions = version.dimensions.map((dimension) => {
      return {
        ...dimension,
        id: dimension.name,
        newId:
          dimension.id +
          "&&" +
          version.version +
          "&&" +
          edition +
          "&&" +
          datasetId,
        value: dimension.name,
      };
    });
    return {
      ...version,
      label: version.version,
      newId: version.version + "&&" + edition + "&&" + datasetId,
      value: version.version,
      dimensions: newDimensions,
    };
  });
  return await finalData;
}

// GET DIMENSION LIST
export async function getDimensionList(datasetId, edition, version) {
  const response = await fetch(
    "https://api.beta.ons.gov.uk/v1/datasets/" +
      datasetId +
      "/editions/" +
      edition +
      "/versions/" +
      version
  );
  const data = await response.json();
  let finalData = [];
  for (let i = 0; i < (await data.dimensions.length); i++) {
    const optionList = getOptionList(
      datasetId,
      edition,
      version,
      data.dimensions[i].name
    );

    finalData.push({
      ...data.dimensions[i],
      id: data.dimensions[i].name,
      newId:
        data.dimensions[i].id +
        "&&" +
        version +
        "&&" +
        edition +
        "&&" +
        datasetId,
      value: data.dimensions[i].name,
      options: await optionList,
    });
  }
  return await finalData;
}

// GET DIMENSION OPTION LIST
export async function getOptionList(
  datasetId,
  edition,
  version,
  dimensionName
) {
  const response = await fetch(
    "https://api.beta.ons.gov.uk/v1/datasets/" +
      datasetId +
      "/editions/" +
      edition +
      "/versions/" +
      version +
      "/dimensions/" +
      dimensionName +
      "/options?limit=1000"
  );

  const data = await response.json();
  let addAll = true;
  const finalData = await data.items.map((option) => {
    if (option.option === "all") {
      addAll = false;
    }
    return {
      ...option,
      id: option.option,
      newId:
        option.option +
        "&&" +
        dimensionName +
        "&&" +
        version +
        "&&" +
        edition +
        "&&" +
        datasetId,
      value: option.option,
    };
  });

  if ((await finalData.length) > 1 && addAll) {
    finalData.unshift({
      id: "all",
      newId:
        "all" +
        "&&" +
        dimensionName +
        "&&" +
        version +
        "&&" +
        edition +
        "&&" +
        datasetId,
      value: "all",
      label: "All",
    });
  }
  return finalData;
}

// GET OBSERVATIONS
export async function getObservations(
  datasetId,
  edition,
  version,
  dimensionFilters
) {
  let filterArray = [];
  for (let i = 0; i < dimensionFilters.length; i++) {
    let value = undefined;
    if (dimensionFilters[i].value === "all") {
      value = "*";
    } else {
      value = dimensionFilters[i].value;
    }

    filterArray.push(dimensionFilters[i].name + "=" + value);
  }
  const filterString = filterArray.join("&");
  const response = await fetch(
    "https://api.beta.ons.gov.uk/v1/datasets/" +
      datasetId +
      "/editions/" +
      edition +
      "/versions/" +
      version +
      "/observations?" +
      filterString
  );
  const data = await response.json();
  if ((await data.total_observations) > 1) {
    if (data.observations[0].dimensions) {
      if (data.observations[0].dimensions.Time) {
        data.observations.sort((a, b) => {
          let periodA = a.dimensions.Time.label
            .replace(/ /g, "")
            .replace("Q", "0");
          let periodB = b.dimensions.Time.label
            .replace(/ /g, "")
            .replace("Q", "0");
          if (periodA < periodB) {
            return -1;
          }
          if (periodB < periodA) {
            return 1;
          }
          return 0;
        });
      }
    }
  }
  
  return await data;
}

export default getDatasetList;
