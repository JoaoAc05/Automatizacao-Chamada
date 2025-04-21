import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da Plataforma Educacional UniFasipe',
      version: '1.0.0',
      description: 'Documentação das rotas da API do sistema acadêmico.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./Routes/*.js'], // garante que todas as rotas com JSDoc serão incluídas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;