export * from "./types/cpu";
export * from "./types/load";
export * from "./types/memory";
export * from "./types/user";

export * from "./app/system";
export * from "./app/user";
export * from "./app/memory";
export * from "./app/cpu";
export * from "./app/network";
export * from "./app/load";

import * as system from "./app/system";
import * as user from "./app/user";
import * as memory from "./app/memory";
import * as cpu from "./app/cpu";
import * as network from "./app/network";
import * as load from "./app/load";

const miniOS = {
  ...system,
  ...user,
  ...memory,
  ...cpu,
  ...network,
  ...load,
};

export default miniOS;
