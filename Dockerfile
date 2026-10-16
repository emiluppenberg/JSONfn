FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["JSONfn.csproj", "./"]
COPY ["JSONfn.Client/JSONfn.Client.csproj", "JSONfn.Client/"]
RUN dotnet restore "./JSONfn.csproj"

COPY . .
RUN dotnet publish "./JSONfn.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

EXPOSE 8080

ENTRYPOINT ["dotnet", "JSONfn.dll"]
