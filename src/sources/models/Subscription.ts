import ParseServer from "../implementaions/ParseServer";

const Subscription = ParseServer.Object.extend("Subscription");

export const addSubscribe = (
  customer: string,
  packageId: string,
  from: string,
  to: string,
  limit: number,
  count: number
): Promise<typeof Subscription> => {
  let subscribe: ParseServer.Object = new Subscription();
  return subscribe.save({
    customer,
    packageId,
    from,
    to,
    limit,
    count,
  });
};

export default Subscription;
