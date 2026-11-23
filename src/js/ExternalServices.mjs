const baseURL = import.meta.env.VITE_SERVER_URL;
const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  // The server sends details about what went wrong in a JSON body.
  // If the body is not JSON (for example a gateway error), fall back to a plain message.
  const message = await res
    .json()
    .catch(() => `Request failed: ${res.status} ${res.statusText}`);
  throw { name:"servicesError", message };
}

export default class ExternalServices {
  async getData(query) {
    const response = await fetch(
      `${baseURL}products/search/${encodeURIComponent(query)}`,
    );
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(query) {
    const productsByCategory = await Promise.all(
      categories.map((category) => this.getData(category)),
    );
    const normalizedQuery = query.trim().toLowerCase();

    return productsByCategory
      .flat()
      .filter((product) =>
        [
          product.Name,
          product.NameWithoutBrand,
          product.Brand?.Name,
        ].some((value) => value?.toLowerCase().includes(normalizedQuery)),
      );
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout`, options).then(convertToJson);
  }
}