const baseURL = import.meta.env.VITE_SERVER_URL;
const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
}

export default class ProductData {
  async getData(query) {
    const response = await fetch(
      `${baseURL}products/search/${encodeURIComponent(query)}`,
    );
    const data = await convertToJson(response);
    return Array.isArray(data.Result) ? data.Result : [];
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
}
