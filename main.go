package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"

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

	app.Listen(":3900")
}

func ServeMDX(app *fiber.App) error {
	app.Get("/presentation-mdx/:slide", func(c *fiber.Ctx) error {
		pwd, err := os.Getwd()
		if err != nil {
			return c.SendString("error: Could not get working directory")
		}
		fmt.Printf("pwd: %v\n", pwd)
		filePath := fmt.Sprintf("%s/next/src/presentation.mdx", pwd)
		content, err := os.ReadFile(filePath)
		if err != nil {
			return c.SendString("error: File not found")
		}
		contentString := string(content)
		fmt.Printf("contentString: %v\n", contentString)
		splitString := strings.Split(contentString, "---")
		fmt.Printf("splitString: %v\n", splitString)
		slide := c.Params("slide")
		slideNumber, err := strconv.Atoi(slide)
		fmt.Printf("slide: %v\n", slideNumber)

		if err != nil || slideNumber < 0 {
			return c.SendString("error: Invalid slide number")
		} else if slideNumber > len(splitString) || slideNumber < 1 {
			return c.SendString("error: Slide not found")
		}
		slideNumber--

		slideContent := splitString[slideNumber]
		if slideContent == "" {
			return c.SendString("error: Slide content not found")
		}
		fmt.Printf("slideContent: %v\n", slideContent)
		return c.SendString(slideContent)
	})
	return nil
}
