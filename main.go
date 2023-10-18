package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET, POST, PUT, DELETE, HEAD, PATCH, OPTIONS",
	}))
	ServeMDX(app)

	app.Static("/assets", "./react/dist/assets/")
	app.Static("/presentation/*", "./react/dist/")

	app.Listen(":5000")
}

func ServeMDX(app *fiber.App) error {
	app.Get("/presentation-mdx", func(c *fiber.Ctx) error {
		pwd, err := os.Getwd()
		if err != nil {
			return c.SendString("error: Could not get working directory")
		}
		fmt.Printf("pwd: %v\n", pwd)
		filePath := fmt.Sprintf("%s/astro/presentation.mdx", pwd)
		content, err := os.ReadFile(filePath)
		if err != nil {
			return c.SendString("error: File not found")
		}
		contentString := string(content)
		fmt.Printf("contentString: %v\n", contentString)
		return c.SendString(contentString)
	})
	return nil
}
