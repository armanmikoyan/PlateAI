export class AiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiConfigError';
  }
}

export class AiProviderError extends Error {
  readonly provider: string;

  constructor(provider: string, message: string) {
    super(message);
    this.name = 'AiProviderError';
    this.provider = provider;
  }
}

export class AiParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiParseError';
  }
}
