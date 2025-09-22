import Server from '@config/server';
import routes from '@routes';

const { app, server } = new Server().router(routes).listen(8080);

export default app;
export { server };
