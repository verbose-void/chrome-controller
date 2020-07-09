# Chrome Controller (Browser Extension)

**If you enjoy the extension, consider [becoming a patron](https://www.patreon.com/chromecontroller) or [buying me a coffee](https://buymeacoff.ee/mccrearyd) :)**

My name is Dyllan McCreary and I'm the original developer of Chrome Controller. It started as a fun high school project to let me relax even harder while on my computer all day. From my bed! Now it's gained some traction and I've hired another engineer to take care of the project. Currently it's very buggy and in beta, but this month (July 2020) I'm shooting for an official version 1 release with more stability & performance + features!

But it's very expensive to maintain a project like this. With artwork, maintenance, hosting, etc. So I'm asking for your [help](https://www.patreon.com/chromecontroller). :)

## What is Chrome Controller?
- Equipped with a secondary mouse cursor for your controller and on screen keyboard, you can browse in leisure from a distance! Supports any Gamepad API compatible controller via bluetooth & wired connections. Supported controllers include but are not limited to: Xbox 360/1 and PlayStation 3/4.
- Just connect to your computer via Bluetooth (or wired if you have the USB connector), add the extension to chrome, and browse away!

Download from the Google Web Store [here](https://chrome.google.com/webstore/detail/chrome-controller/nilnjekagachinflbdkanmblmjpaimhl?hl=en-US&gl=US "Chrome Extension Page")!

**Note**: Chrome Controller is **currently in beta**. Version 1 official release is scheduled for July 2020 with tons of bug fixes, performance increase, and hopefully new features! Please report any issues by email to support@chromecontroller.com

## Not sure if your controller will work?
- Documented controllers supported: https://html5gamepad.com/controllers/
- Doesn't show up or not convinced? Test your controller here with no download necessary: https://html5gamepad.com/

## Controller Setup:
- All you have to do is plug your controller in via USB to where your computer can recognize it, and install Chrome Controller!
- The rest gets taken care of by Chrome Controller!

## Bluetooth Controller Setup Instructions:
- [Mac Bluetooth Setup](https://support.apple.com/guide/mac-help/connect-a-bluetooth-device-blth1004/mac)
- [Windows 7 Bluetooth Setup](https://support.microsoft.com/en-us/help/15290/windows-connect-bluetooth-device)
- [Windows 10 Bluetooth Setup](https://www.windowscentral.com/how-and-why-use-bluetooth-on-windows-10)
- [Linux Bluetooth Setup](https://www.addictivetips.com/ubuntu-linux-tips/pair-and-use-bluetooth-devices-on-linux/)
- [Chrome Book Bluetooth Setup](https://support.google.com/chromebook/answer/2587653?hl=en)

## Artwork
[![Promo Video](https://img.youtube.com/vi/gWI6-R53KII/0.jpg)](https://www.youtube.com/watch?v=gWI6-R53KII)

![](https://lh3.googleusercontent.com/6Bg3wIPEiUO8Yi-j0EHxwHqQtgpLlptSw2JHr1zO3xMh5TDFCYVdQTU1V91VTj1ahGamdWKelQ=w640-h400-e365)

![](https://lh3.googleusercontent.com/3bWw_SA08t-MqNivKMA3NlkuY3f4B4dXQswKVrEfnjxKJoJrv406UOE_FHe9nmtnzaFrdTtAjQ=w640-h400-e365)

![](https://lh3.googleusercontent.com/5KN3UmbYwZbJKQ3miTTWx-x0Xd5NtDmPfs6UUdsRbsUXWUCQuMzzVaan5U6gHCLO2fACjhakGDw=w640-h400-e365)

![](https://lh3.googleusercontent.com/7LJTC79XDJlT4CimSDkSFfoIUMZ2DFagzZWswM7f7zz2sy5IcIzbpgloztJ-TLMEGWOEwcivRbw=w640-h400-e365)

![](https://ksr-ugc.imgix.net/assets/022/661/690/1644e7b7f269bff9c7914090e25156d0_original.jpg?ixlib=rb-1.1.0&w=680&fit=max&v=1537817903&auto=format&gif-q=50&q=92&s=0d4cc9259698dd2808976df64e9d5707)

 ## Developers:
 
This is the front-end repository. If you would like to make contributions to our backend, please reach out to development@chromecontroller.com.
 
### Setting up your development environment: 
1. Clone this repository.
2. Make sure you have Google Chrome installed.
3. In the google chrome address bar, type `chrome://extensions`. In the top left corner, click `load unpacked`. This will ask for a folder, navigate to where you cloned the repository.
4. Bang! You now can reload your webpages and make source code modifications.
5. Deploying your build can be done by zipping up the contents of your source code version and creating a pull request with that zip file as an attachment. Make sure you update the `manifest.json` with an updated version number.
