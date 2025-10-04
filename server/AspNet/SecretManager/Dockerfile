# 1. Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5227

# 2. SDK для сборки
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SecretManager.csproj", "./"]
RUN dotnet restore "SecretManager.csproj"

COPY . .
RUN dotnet build "SecretManager.csproj" -c Release -o /app/build

# 3. Publish
FROM build AS publish
RUN dotnet publish "SecretManager.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 4. Runtime
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SecretManager.dll"]
