export class GetUserDataByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly lang: string,
  ) {}
}
