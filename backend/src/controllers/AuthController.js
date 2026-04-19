export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (request, response) => {
    const result = await this.authService.register(request.validated.body);
    response.status(201).json(result);
  };

  login = async (request, response) => {
    const result = await this.authService.login(request.validated.body);
    response.status(200).json(result);
  };

  me = async (request, response) => {
    const result = await this.authService.getProfile(request.user.id);
    response.status(200).json({ user: result });
  };
}

