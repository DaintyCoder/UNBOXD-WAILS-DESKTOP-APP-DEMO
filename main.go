package main

import (
	"embed"
	"log"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	iconData, err := os.ReadFile("qr-icon.png")
	if err != nil {
		log.Printf("Warning: Could not load icon: %v", err)
	}

	err = wails.Run(&options.App{
		Title:  "QR Code Generator",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 0},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Linux: &linux.Options{
			Icon: iconData, // Set icon for Linux window and panel
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
