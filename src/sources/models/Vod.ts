import ParseServer from "../implementaions/ParseServer";

const Vod = ParseServer.Object.extend("Vod");
const VodQuery = new ParseServer.Query(Vod);

export enum VodStatus {
  AVAILABLE,
  SOON,
  DELETED,
  DISABLED,
}

export const addVod = async (
  path: string,
  qualityOptions: Array<string>,
  name: string,
  subName: string,
  image: string,
  isActive: boolean,
  shortVideoPath: string,
  desc: string,
  actors: Array<string>,
  directors: Array<string>,
  released: string,
  status: VodStatus,
  rating: number,
  duration: number,
  series: boolean,
  episode: string,
  season: number,
  imdbRating: number,
  category: string,
  genre: string,
  packageId: string,
  nextVod: string | null
): Promise<typeof Vod> => {
  let vod: ParseServer.Object = new Vod();
  return vod.save({
    path,
    qualityOptions,
    name,
    subName,
    image,
    isActive,
    shortVideoPath,
    desc,
    actors,
    directors,
    released,
    status,
    rating,
    nextVod,
    duration,
    series,
    season,
    episode,
    imdbRating,
    category,
    genre,
    packageId,
  });
};

export default Vod;
