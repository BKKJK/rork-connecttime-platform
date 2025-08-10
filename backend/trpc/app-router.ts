import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { profileStatsProcedure, updateProfileProcedure } from "./routes/profile/stats/route";
import { 
  paymentMethodsProcedure, 
  addPaymentMethodProcedure, 
  removePaymentMethodProcedure, 
  setDefaultPaymentMethodProcedure 
} from "./routes/payments/methods/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  profile: createTRPCRouter({
    stats: profileStatsProcedure,
    update: updateProfileProcedure,
  }),
  payments: createTRPCRouter({
    methods: paymentMethodsProcedure,
    addMethod: addPaymentMethodProcedure,
    removeMethod: removePaymentMethodProcedure,
    setDefault: setDefaultPaymentMethodProcedure,
  }),
});

export type AppRouter = typeof appRouter;