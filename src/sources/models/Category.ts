import ParseServer from "../implementaions/ParseServer";

const Category = ParseServer.Object.extend("Category");

export const addCategory = async (
  name: string,
  email: string,
  desc: string,
  image: string,
  isActive: boolean,
  user: any | null
): Promise<typeof Category> => {
  let cat: ParseServer.Object = new Category();
  cat.set("name", name);
  cat.set("email", email);
  cat.set("desc", desc || "");
  cat.set("image", image);
  cat.set("isActive", isActive);
  cat.set("user", user);
  return cat.save();
};

export default Category;
