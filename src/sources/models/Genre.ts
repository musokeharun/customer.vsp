import ParseServer from "../implementaions/ParseServer";

const Genre = ParseServer.Object.extend("Genre");

export const addGenre = async (
  name: string,
  desc: string,
  order: string,
  isActive: boolean,
  parent: ParseServer.Object,
  user: ParseServer.Object | null
): Promise<typeof Genre> => {
  let genre: ParseServer.Object = new Genre();

  return genre.save({
    name,
    desc,
    order,
    isActive,
    parent,
    user,
  });
};

export default Genre;
