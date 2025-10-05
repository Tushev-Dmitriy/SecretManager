using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Data;
using SecretManager.Keys.Service;
using SecretManager.OpenBao.Services;
using SecretManager.Request.Services;

// Создание билдер
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Сервисы
builder.Services.AddScoped<RequestService>();
builder.Services.AddScoped<KeysService>();

// HttpClient для OpenBao
builder.Services.AddHttpClient<OpenBaoService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["OpenBao:Url"]);
    client.DefaultRequestHeaders.Add("X-Vault-Token", builder.Configuration["OpenBao:Token"]);
});

// Регистрация OpenBaoInitializer
builder.Services.AddScoped<OpenBaoInitializer>();

// Аутентификация
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["Keycloak:Authority"];
    options.Audience = builder.Configuration["Keycloak:Audience"];
    options.RequireHttpsMetadata = false;

    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = false,
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = false
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SecretManager API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<OpenBaoInitializer>();
    try
    {
        await initializer.SeedAllAsync();
        Console.WriteLine("✅ Демо-секреты OpenBao успешно созданы!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Ошибка инициализации секретов OpenBao: {ex.Message}");
    }
}

app.Run();
