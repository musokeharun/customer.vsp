import ParseServer from "../implementaions/ParseServer";

const Category = ParseServer.Object.extend("Category");

export const addCategory = async (
  name: string,
  desc: string,
  image: string,
  isActive: boolean,
  user: any | null
): Promise<ParseServer.Object> => {
  let cat: ParseServer.Object = new Category();
  cat.set("name", name);
  cat.set("desc", desc || "");
  cat.set("image", image);
  cat.set("isActive", isActive);
  cat.set("user", user);
  return cat.save();
};

export default Category;
